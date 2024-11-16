# TripTally

TripTally is a social platform designed to help users rate and share their travel experiences while discovering new places to explore.

## Features Added

### JSON Documents for Experiences

Added 4 JSON documents to the `/api/experience` endpoint for the following experiences:

- **Hiking Adventure**: `/api/experience/hiking`
- **Food Tasting Tour**: `/api/experience/foodtasting`
- **Skydiving**: `/api/experience/skydiving`
- **Mountain Biking Adventure**: `/api/experience/mountainbiking`

### Home Page Integration

Included all relevant HTML files within the JSON documents since my chosen custom element resides on the home page. This element links to all other pages, so it's essentiall to add the links to keep all the main functionality and navigation.

### Example: Hiking JSON

```json
{
  "_id": {
    "$oid": "6737f240664f8d287cd62164"
  },
  "id": "hiking",
  "title": "Hiking Adventure",
  "category": "Adventure",
  "location": "Grand Canyon, USA",
  "rating": 3.5,
  "user": "John Doe",
  "description": "Hike through the majestic Grand Canyon and enjoy breathtaking views.",
  "detailPage": "experience.html",
  "locationPage": "location.html",
  "categoryPage": "category.html",
  "userPage": "profile.html",
  "reviews": [
    {
      "text": "John Doe - \"Challenging but worth it!\"",
      "link": "review.html"
    }
  ]
}
```

---

## Future Enhancements / Features

### Component Development
- Build components for all key sections:
  - Category, Experience, Location, Profile, Review.
  - Use the stars component for dynamic star ratings.

### Visual and Content Improvements
- Add images to subpages.
- Maybe adding visuals to the main index
  
### Advanced Rating Criteria
- Introduce additional rating categories such as:
  - Value for money
  - Accessibility
  - Scenery, etc.

### Location Integration
- Implement a map feature:
  - Plot experiences on a global map.
  - Allow users to explore experiences geographically for more interaction.
