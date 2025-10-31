from tracker.core import PriceTrackerCore

if __name__ == "__main__":

    db_path = "../backend/db.sqlite"

    tracker = PriceTrackerCore(db_path)
    tracker.start_from_db()
