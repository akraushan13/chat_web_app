ASGI_APPLICATION = "whatsapp.asgi.application"

CHANNEL_LAYERS = {
    'default' : {
        'BACKEND' : 'channels.layers.InMemoryChannelLayer'
    }
}