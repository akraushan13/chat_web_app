web: daphne whatsapp.routing:application --port $PORT --bind 0.0.0.0 -v2
worker: python manage.py runworker channels --settings=whatsapp.settings.production -v2