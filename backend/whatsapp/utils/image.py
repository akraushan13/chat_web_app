from datetime import datetime

def uploaded_image_path(instance, filename):
    path = f'{instance._meta.model_name}/{datetime.today()}'
    return f'{path}/{filename}'