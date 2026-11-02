# OnSpot — Spot Discovery

A community platform to discover, rate and share the best places to visit. Users add spots with a photo and description, leave reviews with ratings, tag what makes each place special, and save their favourites.

Built as the DIAM course project.

![OnSpot home page](screenshots/home.png)

## Features

- **Browse & search:** an infinite-scrolling grid of places, with search by title or by prefix (`title:`, `location:`, `rating:`, `tag:`)
- **Reviews & ratings:** 0–5 star reviews; each place's rating is the average of its reviews
- **Tags:** reviewers like tags such as *Praia* or *Natureza*, and each place shows its most liked ones
- **Favourites:** save places with one click and list them under *Favoritos*
- **My places:** create, edit and delete the places you added
- **Accounts:** register, log in and a profile page with a photo
- **Moderation:** offensive words are blocked in places and reviews; admins can manage tags
- **REST API:** a token-authenticated JSON API (`/api/...`) used by the site and by the React client

## Tech stack

| Layer    | Technologies                                                       |
| -------- | ------------------------------------------------------------------ |
| Backend  | Python, Django, Django REST Framework, SQLite                      |
| Website  | Django templates, jQuery, CSS                                      |
| Frontend | React 18, TypeScript, Vite, React Router, Axios (in `frontend/`)   |

## Getting started

### Backend (serves the full website)

```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install django djangorestframework django-cors-headers pillow requests
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

Open <http://localhost:8000>.

### React frontend (optional)

```bash
cd frontend
npm install
echo "VITE_BACKEND_URL=http://localhost:8000" > .env
npm run dev
```

## Project structure

```
backend/
├── backend/   # Django settings and root URLs
├── myapi/     # Models, serializers and REST API endpoints
└── website/   # Server-rendered pages, static CSS/JS and images
frontend/      # React + TypeScript client
```
