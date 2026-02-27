from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.authentication import JWTAuthentication
from urllib.parse import parse_qs

User = get_user_model()
jwt_auth = JWTAuthentication()


@database_sync_to_async
def get_user_from_token(token_key):
    try:
        validated_token = jwt_auth.get_validated_token(token_key)
        return jwt_auth.get_user(validated_token)
    except Exception:
        return None


class JWTAuthMiddleware:
    def __init__(self, inner):
        self.inner = inner

    async def __call__(self, scope, receive, send):
        query_string = scope["query_string"].decode()
        query_params = parse_qs(query_string)

        token = query_params.get("token")

        if token:
            scope["user"] = await get_user_from_token(token[0])
        else:
            scope["user"] = None

        return await self.inner(scope, receive, send)