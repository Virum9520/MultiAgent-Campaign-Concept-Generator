"""Seed ChromaDB with campaign examples.

Run: python -m app.seed.seed_chroma
"""

import json
from pathlib import Path

from app.services.chroma_service import store_campaign


def seed():
    data_path = Path(__file__).parent.parent.parent / "data" / "campaign_examples.json"
    with open(data_path) as f:
        campaigns = json.load(f)

    for campaign in campaigns:
        store_campaign(
            campaign_id=campaign["id"],
            summary=(
                f"{campaign['brand']} — {campaign['campaign_name']}: "
                f"{campaign['summary']}"
            ),
            metadata={
                "brand": campaign["brand"],
                "industry": campaign["industry"],
                "campaign_name": campaign["campaign_name"],
                "channels": ", ".join(campaign["channels"]),
                "audience": campaign["audience"],
                "outcomes": campaign.get("outcomes", ""),
            },
        )
        print(f"  Seeded: {campaign['brand']} — {campaign['campaign_name']}")

    print(f"\nDone! Seeded {len(campaigns)} campaigns.")


if __name__ == "__main__":
    seed()
