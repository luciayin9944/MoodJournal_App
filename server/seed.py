# seed.py

from app import create_app
from config import db
from models import User, Journal, JournalEntry, Suggestion
from datetime import date


def reset_database():
    db.drop_all()
    db.create_all()

def seed_data():
    # user
    user = User(
        username="testuser",
        email="test@example.com",
    )
    user.password_hash = "password123"  

    db.session.add(user)
    db.session.commit()

    #journal
    journal = Journal(
        week_number=29,
        year=2025,
        user_id=user.id
    )
    db.session.add(journal)
    db.session.commit()

  
    entry1 = JournalEntry(
            journal_id=journal.id,
            entry_date=date(2025, 7, 14),
            mood_tag= "Tired",
            mood_score= 4,
            notes = "Felt very tired after work. Just wanted to sleep."
        )
    
    entry2 = JournalEntry(
            journal_id=journal.id,
            entry_date=date(2025, 7, 15),
            mood_tag= "Happy",
            mood_score=7,
            notes = "Had a productive morning. Mood was better than yesterday."
        )
    
    entry3= JournalEntry(
            journal_id=journal.id,
            entry_date=date(2025, 7, 16),
            mood_tag="Overwhelmed",
            mood_score=5,
            notes = "Too many meetings. Overwhelmed and drained."
        )
    
    entry4= JournalEntry(
            journal_id=journal.id,
            entry_date=date(2025, 7, 17),
            mood_tag= "Joyful",
            mood_score=7,
            notes = "Spent time with friends. Laughed a lot. Felt good."
        )
    
    entry5= JournalEntry(
            journal_id=journal.id,
            entry_date=date(2025, 7, 18),
            mood_tag= "Tired",
            mood_score=5,
            notes = "Low energy all day. Didn't feel like doing much."
        )
    
    entry6= JournalEntry(
            journal_id=journal.id,
            entry_date=date(2025, 7, 19),
            mood_tag= "Joyful",
            mood_score=9,
            notes = "Went hiking. It helped clear my mind."
        )
    
    entry7= JournalEntry(
            journal_id=journal.id,
            entry_date=date(2025, 7, 20),
            mood_tag= "Anxious",
            mood_score=9,
            notes = "Back to work stress again. Feeling anxious about deadlines."
        )

    db.session.add_all([entry1, entry2, entry3, entry4, entry5, entry6, entry7])
    db.session.commit()


    
    ## suggestion
    suggestion = Suggestion(
        journal_id=journal.id,
        summary = "The emotional trend seems to fluctuate throughout the week, with moments of tiredness, productivity, overwhelm, joy with friends, low energy, clarity after hiking, and anxiety about work deadlines.",
        selfcare_tips = "a. Practice mindfulness techniques to manage feelings of overwhelm and anxiety. Take a few minutes each day to focus on your breath and bring yourself back to the present moment."
                        "b. Prioritize self-care activities that bring you joy and energy, such as spending more time with friends, engaging in activities you love, or getting regular exercise to boost your mood and energy levels."
        )
    db.session.add(suggestion)
    db.session.commit()


    print("✅ Database seeded successfully.")

if __name__ == "__main__":
    app = create_app()
    with app.app_context():
        reset_database()
        seed_data()