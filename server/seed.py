# # seed.py

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

    ## === Week 29 ===
    journal_29 = Journal(
        week_number=29,
        year=2025,
        user_id=user.id
    )
    db.session.add(journal_29)
    db.session.commit()

    entries_29 = [
        JournalEntry(journal_id=journal_29.id, entry_date=date(2025, 7, 14), mood_tag="Tired", mood_score=4, notes="Felt very tired after work. Just wanted to sleep."),
        JournalEntry(journal_id=journal_29.id, entry_date=date(2025, 7, 15), mood_tag="Happy", mood_score=7, notes="Had a productive morning. Mood was better than yesterday."),
        JournalEntry(journal_id=journal_29.id, entry_date=date(2025, 7, 16), mood_tag="Overwhelmed", mood_score=5, notes="Too many meetings. Overwhelmed and drained."),
        JournalEntry(journal_id=journal_29.id, entry_date=date(2025, 7, 17), mood_tag="Joyful", mood_score=7, notes="Spent time with friends. Laughed a lot. Felt good."),
        JournalEntry(journal_id=journal_29.id, entry_date=date(2025, 7, 18), mood_tag="Tired", mood_score=5, notes="Low energy all day. Didn't feel like doing much."),
        JournalEntry(journal_id=journal_29.id, entry_date=date(2025, 7, 19), mood_tag="Joyful", mood_score=9, notes="Went hiking. It helped clear my mind."),
        JournalEntry(journal_id=journal_29.id, entry_date=date(2025, 7, 20), mood_tag="Anxious", mood_score=9, notes="Back to work stress again. Feeling anxious about deadlines.")
    ]
    db.session.add_all(entries_29)

    suggestion_29 = Suggestion(
        journal_id=journal_29.id,
        summary="The emotional trend seems to fluctuate throughout the week, with moments of tiredness, productivity, overwhelm, joy with friends, low energy, clarity after hiking, and anxiety about work deadlines.",
        selfcare_tips="1. Practice mindfulness techniques to manage feelings of overwhelm and anxiety. Take a few minutes each day to focus on your breath and bring yourself back to the present moment."
                      "2. Prioritize self-care activities that bring you joy and energy, such as spending more time with friends, engaging in activities you love, or getting regular exercise to boost your mood and energy levels."
    )
    db.session.add(suggestion_29)

    ## === Week 30 ===
    journal_30 = Journal(
        week_number=30,
        year=2025,
        user_id=user.id
    )
    db.session.add(journal_30)
    db.session.commit()

    entries_30 = [
        JournalEntry(journal_id=journal_30.id, entry_date=date(2025, 7, 21), mood_tag="Calm", mood_score=6, notes="Started the week with meditation. Felt peaceful."),
        JournalEntry(journal_id=journal_30.id, entry_date=date(2025, 7, 22), mood_tag="Productive", mood_score=8, notes="Deep work session. Made good progress."),
        JournalEntry(journal_id=journal_30.id, entry_date=date(2025, 7, 23), mood_tag="Disappointed", mood_score=5, notes="Hard to stay focused today."),
        JournalEntry(journal_id=journal_30.id, entry_date=date(2025, 7, 24), mood_tag="Joyful", mood_score=7, notes="Talked to family. Reminded me of what's important."),
        JournalEntry(journal_id=journal_30.id, entry_date=date(2025, 7, 25), mood_tag="Productive", mood_score=8, notes="Great workout today."),
        JournalEntry(journal_id=journal_30.id, entry_date=date(2025, 7, 26), mood_tag="Relaxed", mood_score=7, notes="Relaxed weekend. Feeling balanced."),
        JournalEntry(journal_id=journal_30.id, entry_date=date(2025, 7, 27), mood_tag="Worried", mood_score=4, notes="Worried about upcoming deadlines.")
    ]
    db.session.add_all(entries_30)

    suggestion_30 = Suggestion(
        journal_id=journal_30.id,
        summary="The week started peacefully and productively but ended with some worry. Balancing mindfulness and productivity helped, but stress resurfaced.",
        selfcare_tips="1. Continue mindfulness practices throughout the week to stay grounded. 2. Create a clear plan for handling upcoming deadlines to reduce worry and regain control."
    )
    db.session.add(suggestion_30)

    ## === Week 31 ===
    journal_31 = Journal(
        week_number=31,
        year=2025,
        user_id=user.id
    )
    db.session.add(journal_31)
    db.session.commit()

    entries_31 = [
        JournalEntry(journal_id=journal_31.id, entry_date=date(2025, 7, 28), mood_tag="Productive", mood_score=7, notes="Set clear goals. Felt motivated."),
        JournalEntry(journal_id=journal_31.id, entry_date=date(2025, 7, 29), mood_tag="Overwhelmed", mood_score=4, notes="Technical issues blocked my progress."),
        JournalEntry(journal_id=journal_31.id, entry_date=date(2025, 7, 30), mood_tag="Hopeful", mood_score=6, notes="Found a workaround. Things are looking up."),
        JournalEntry(journal_id=journal_31.id, entry_date=date(2025, 7, 31), mood_tag="Productive", mood_score=8, notes="Big breakthrough! Finished major task."),
        JournalEntry(journal_id=journal_31.id, entry_date=date(2025, 8, 1), mood_tag="Calm", mood_score=7, notes="Smooth day. Kept a good pace."),
        JournalEntry(journal_id=journal_31.id, entry_date=date(2025, 8, 2), mood_tag="Relaxed", mood_score=5, notes="Didn't do much. Just rested."),
        JournalEntry(journal_id=journal_31.id, entry_date=date(2025, 8, 3), mood_tag="Calm", mood_score=8, notes="Reflected on the week. Felt proud.")
    ]
    db.session.add_all(entries_31)

    suggestion_31 = Suggestion(
        journal_id=journal_31.id,
        summary="This week was a rollercoaster: frustration mid-week, recovery, then solid wins and reflection. Good resilience shown.",
        selfcare_tips="1. Acknowledge progress and celebrate small wins. 2. Maintain flexibility when facing obstacles, and build in rest days like the weekend to recover."
    )
    db.session.add(suggestion_31)

    db.session.commit()
    print("✅ Database seeded successfully.")

if __name__ == "__main__":
    app = create_app()
    with app.app_context():
        reset_database()
        seed_data()












# from app import create_app
# from config import db
# from models import User, Journal, JournalEntry, Suggestion
# from datetime import date


# def reset_database():
#     db.drop_all()
#     db.create_all()

# def seed_data():
#     # user
#     user = User(
#         username="testuser",
#         email="test@example.com",
#     )
#     user.password_hash = "password123"  

#     db.session.add(user)
#     db.session.commit()

#     #journal
#     journal = Journal(
#         week_number=29,
#         year=2025,
#         user_id=user.id
#     )
#     db.session.add(journal)
#     db.session.commit()

  
#     entry1 = JournalEntry(
#             journal_id=journal.id,
#             entry_date=date(2025, 7, 14),
#             mood_tag= "Tired",
#             mood_score= 4,
#             notes = "Felt very tired after work. Just wanted to sleep."
#         )
    
#     entry2 = JournalEntry(
#             journal_id=journal.id,
#             entry_date=date(2025, 7, 15),
#             mood_tag= "Happy",
#             mood_score=7,
#             notes = "Had a productive morning. Mood was better than yesterday."
#         )
    
#     entry3= JournalEntry(
#             journal_id=journal.id,
#             entry_date=date(2025, 7, 16),
#             mood_tag="Overwhelmed",
#             mood_score=5,
#             notes = "Too many meetings. Overwhelmed and drained."
#         )
    
#     entry4= JournalEntry(
#             journal_id=journal.id,
#             entry_date=date(2025, 7, 17),
#             mood_tag= "Joyful",
#             mood_score=7,
#             notes = "Spent time with friends. Laughed a lot. Felt good."
#         )
    
#     entry5= JournalEntry(
#             journal_id=journal.id,
#             entry_date=date(2025, 7, 18),
#             mood_tag= "Tired",
#             mood_score=5,
#             notes = "Low energy all day. Didn't feel like doing much."
#         )
    
#     entry6= JournalEntry(
#             journal_id=journal.id,
#             entry_date=date(2025, 7, 19),
#             mood_tag= "Joyful",
#             mood_score=9,
#             notes = "Went hiking. It helped clear my mind."
#         )
    
#     entry7= JournalEntry(
#             journal_id=journal.id,
#             entry_date=date(2025, 7, 20),
#             mood_tag= "Anxious",
#             mood_score=9,
#             notes = "Back to work stress again. Feeling anxious about deadlines."
#         )

#     db.session.add_all([entry1, entry2, entry3, entry4, entry5, entry6, entry7])
#     db.session.commit()


    
#     ## suggestion
#     suggestion = Suggestion(
#         journal_id=journal.id,
#         summary = "The emotional trend seems to fluctuate throughout the week, with moments of tiredness, productivity, overwhelm, joy with friends, low energy, clarity after hiking, and anxiety about work deadlines.",
#         selfcare_tips = "a. Practice mindfulness techniques to manage feelings of overwhelm and anxiety. Take a few minutes each day to focus on your breath and bring yourself back to the present moment."
#                         "b. Prioritize self-care activities that bring you joy and energy, such as spending more time with friends, engaging in activities you love, or getting regular exercise to boost your mood and energy levels."
#         )
#     db.session.add(suggestion)
#     db.session.commit()


#     print("✅ Database seeded successfully.")

# if __name__ == "__main__":
#     app = create_app()
#     with app.app_context():
#         reset_database()
#         seed_data()