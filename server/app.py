# app.py
from flask import Flask, request, jsonify, make_response
from flask_restful import Api, Resource
from config import db, bcrypt, jwt, Config
from flask_cors import CORS
from models import *  
from sqlalchemy.exc import IntegrityError
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from datetime import date



def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize extensions
    CORS(app)
    db.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)
    api = Api(app)

    # API resources
    # Auth
    api.add_resource(Signup, '/signup')
    api.add_resource(Login, '/login')
    api.add_resource(WhoAmI, '/me')

    # Journal (weekly)
    api.add_resource(JournalList, '/journals')  # GET list paginated
    api.add_resource(JournalWeek, '/journals/<int:year>/<int:week_number>')  # GET entries in week

    # Entry (daily)
    api.add_resource(NewEntry, '/entries')  # POST new, GET by entry_id
    api.add_resource(Entry, '/entries/<int:entry_id>')  # PATCH, DELETE
    api.add_resource(TodayEntry, '/entries/today')  # GET today's entry

    # Suggestion
    api.add_resource(AiSuggestion, '/journals/<int:year>/<int:week_number>/suggestion')

    return app


class Signup(Resource):
    def post(self):
        data = request.get_json()
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        password_confirmation = data.get('password_confirmation')
        errors = []

        #validations
        if not username or len(username) < 3:
            errors.append("Username must be at least 3 characters")
        if not email or '@' not in email:
            errors.append("Invalid email")
        if not password or len(password) < 6:
            errors.append("Password must be at least 6 characters")
        if password != password_confirmation:
            errors.append("Passwords do not match")

        if errors:
            return jsonify({'errors': errors}), 400
        
        new_user = User(username=username)
        new_user.email = email
        new_user.password_hash = password
        
        try:
            db.session.add(new_user)
            db.session.commit()
            access_token = create_access_token(identity=str(new_user.id))
            response = make_response(jsonify({
                'token': access_token,
                'user': UserSchema().dump(new_user),
                'message': 'Signup successful!'
            }), 200)
            return response
        except IntegrityError:
            db.session.rollback()
            return {'errors': ['Username or Email already exists']}, 422
        


class WhoAmI(Resource):
    @jwt_required()
    def get(self):
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        if user:
            return UserSchema().dump(user), 200
        return {'errors': ['User not found']}, 404
    

class Login(Resource):
    def post(self):
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        user = User.query.filter_by(email=email).first()

        if user and user.authenticate(password):
            access_token = create_access_token(identity=str(user.id))
            response = make_response(jsonify(token=access_token, user=UserSchema().dump(user)), 200)
            return response
        return {'errors': ['Invalid email or password']}, 401


## '/entries'
class NewEntry(Resource):
    @jwt_required()
    def post(self):
        curr_user_id = get_jwt_identity()
        data = request.get_json()
        curr_date = data.get("entry_date")

        try:
            entry_date = datetime.strptime(curr_date, "%Y-%m-%d").date()
        except Exception:
            return {"error": "Invalid date format. Use YYYY-MM-DD"}, 400
        
        existing_entry = (
            db.session.query(JournalEntry)
            .join(Journal)
            .filter(Journal.user_id==curr_user_id)
            .filter(JournalEntry.entry_date==entry_date)
            .first()
        )
        if existing_entry:
            return {"error": "Entry for this date already exists."}, 400
        
        iso_year, iso_week, _ = entry_date.isocalendar()

        week_journal = Journal.query.filter_by(user_id=curr_user_id, year=iso_year, week_number=iso_week).first()
        if not week_journal:
            ## add new week_journal record to Journal table
            week_journal = Journal(user_id=curr_user_id, year=iso_year,week_number=iso_week)
            db.session.add(week_journal)
            db.session.commit()
        
        ## add new entry to JournalEntry table
        new_entry = JournalEntry(
            journal_id = week_journal.id, 
            entry_date = entry_date,
            notes = data.get("notes"),
            mood_score = data.get("mood_score"),
            mood_tag = data.get("mood_tag")
        )

        try:
            db.session.add(new_entry)
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            return {"error": str(e)}, 500
        
        result = JournalEntrySchema().dump(new_entry)
        return result, 201


## '/entries/<int:entry_id>'
class Entry(Resource):
    @jwt_required()
    def get(self, entry_id):
        curr_user_id = get_jwt_identity()

        entry = (
            db.session.query(JournalEntry)
            .join(Journal)
            .filter(JournalEntry.id == entry_id)
            .filter(Journal.user_id == curr_user_id) 
            .first()
        )
        if not entry:
            return {"error": "Today Journal not found"}, 404 
     
        result = JournalEntrySchema().dump(entry)
        return jsonify(result)
    

    @jwt_required()
    def delete(self, entry_id):
        curr_user_id = get_jwt_identity()
        entry = (
            db.session.query(JournalEntry)
            .join(Journal)
            .filter(JournalEntry.id == entry_id)
            .filter(Journal.user_id == curr_user_id) 
            .first()
        )

        if not entry:
            return {"error": "Journal not found"}, 404
        try:
            db.session.delete(entry)
            db.session.commit()
            return {"message": "Journal deleted successfully"}, 200
        except Exception as e:
            return {"error": str(e)}, 500
        
    
    @jwt_required()
    def patch(self, entry_id):
        curr_user_id = get_jwt_identity()
        entry = (
            db.session.query(JournalEntry)
            .join(Journal)
            .filter(JournalEntry.id == entry_id)
            .filter(Journal.user_id == curr_user_id) 
            .first()
        )

        if not entry:
            return {"error": "Journal not found"}, 404
        
        data = request.get_json()
        entry.entry_date = datetime.strptime(data["entry_date"], "%Y-%m-%d").date() if "entry_date" in data else entry.entry_date
        entry.notes = data.get("notes", entry.notes)
        entry.mood_score = data.get("mood_score", entry.mood_score)
        entry.mood_tag = data.get("mood_tag", entry.mood_tag)

        try:   
            db.session.commit()  
            return JournalEntrySchema().dump(entry), 200 
        except ValueError as e:
            return {"errors": [str(e)]}, 400
        except Exception as e:
            db.session.rollback()
            return {"error": str(e)}, 500


## '/entries/today'
class TodayEntry(Resource):
    @jwt_required()
    def get(self):
        curr_user_id = get_jwt_identity()
        today_str = date.today().isoformat()

        today_entry = (
            db.session.query(JournalEntry)
            .join(Journal)
            .filter(Journal.user_id==curr_user_id)
            .filter(JournalEntry.entry_date==today_str)
            .first()
        )

        if not today_entry:
            return {"message": "No journal found for today."}, 404

        return JournalEntrySchema().dump(today_entry), 200



class JournalWeek(Resource):
    @jwt_required()
    def get(self, year, week_number):
        curr_user_id = get_jwt_identity()

        week_journal = Journal.query.filter_by(user_id=curr_user_id, year=year, week_number=week_number).first()

        if not week_journal:
            return {"message": "No journal found for this week."}, 404
        
        entries = JournalEntry.query.filter_by(journal_id=week_journal.id).order_by(JournalEntry.entry_date.asc()).all()
        print(f"Looking for entries in year={year}, week={week_number} for user {curr_user_id}")
        return jsonify(JournalEntrySchema(many=True).dump(entries))
    

    
class JournalList(Resource):
    @jwt_required()
    def get(self):
        curr_user_id = get_jwt_identity()
        page = request.args.get("page", 1, type=int)
        per_page = 6

        pagination = (
            db.session.query(Journal)
            .filter_by(user_id=curr_user_id)
            .order_by(Journal.year.desc(), Journal.week_number.desc())
            .paginate(page=page, per_page=per_page, error_out=False)
        )

        result = JournalSchema(many=True).dump(pagination.items)

        return jsonify({
            "journals": result,
            "total": pagination.total,
            "page": pagination.page,
            "pages": pagination.pages
        })
    

import os
import json
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

class AiSuggestion(Resource):
    @jwt_required
    def post(self, year, week_number):
        curr_user_id = get_jwt_identity()

        week_journal = Journal.query.filter_by(user_id=curr_user_id, year=year, week_number=week_number).first()
        if not week_journal:
            return {"message": "No journal found for this week."}, 404
        
        entries = JournalEntry.query.filter_by(journal_id=week_journal.id).order_by(JournalEntry.entry_date.asc()).all()

        if len(entries) < 4:
            return {"message": "Not enough journal entries to generate summary (minimum 4 required)."}, 400
        #else:

        ##WRONG; entries_dicts = jsonify(JournalEntrySchema(many=True).dump(entries))
        entry_dicts = JournalEntrySchema(many=True).dump(entries)
        combined_text = "\n".join(
            [f"{entry['entry_date']}: {entry['notes']}" for entry in entry_dicts if entry.get("notes")]
        )
           

        prompt = f"""
        You are a mental health assistant. Please analyze the following weekly journal logs and return your response in valid JSON with two fields: "summary" and "self_care_tips" (an array of 3 tips).
        For the entire week:
        1. Summarize the emotional trend over the week in 2-3 sentences.
        2. Provide 3 personalized, practical self-care suggestions based on the emotional needs.

        Weekly Journal Entries:
        {combined_text}

        Return format:
        {{
            "summary": "<your summary here>",
            "self_care_tips": [
                "<tip 1>",
                "<tip 2>",
                "<tip 3>"
            ]
        }}
        """

        try:
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a supportive and insightful AI assistant focused on emotional well-being."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7
            )
            ai_result = response.choices[0].message.content.strip()

            parsed = json.loads(ai_result)
            summary = parsed.get("summary", "")
            tips = parsed.get("self_care_tips", [])
            tips_text = "\n".join(tips)
        except json.JSONDecodeError:
            return {"error": "Failed to parse AI response as JSON."}, 500
        except Exception as e:
            return {"error": f"OpenAI API error: {str(e)}"}, 500

        ## add new suggestion to Suggestion table
        new_suggestion = Suggestion(
            journal_id = week_journal.id, 
            summary = summary,
            selfcare_tips = tips_text
        )

        try:
            db.session.add(new_suggestion)
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            return {"error": str(e)}, 500
        
        result = SuggestionSchema().dump(new_suggestion)
        return result, 201
    

    @jwt_required()
    def get(self, year, week_number):
        curr_user_id = get_jwt_identity()

        suggestion = (
            Suggestion.query
            .join(Journal)
            .filter(
                Journal.user_id==curr_user_id,
                Journal.year==year,
                Journal.week_number==week_number
            ).first()
        )

        if suggestion:
            return {
                "summary": suggestion.summary,
                "self_care_tips": suggestion.self_care_tips
            }, 200
        else:
            return {"error": "No suggestion found for this week."}, 404












        




        



