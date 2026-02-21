from django.utils.crypto import get_random_string
from time import time


def gen_slug():
    return f'{get_random_string(length=8)}-{time()}'.replace('.','-')