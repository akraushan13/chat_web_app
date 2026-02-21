from django.db import models


class GenderChoices(models.TextChoices):
    male = 'Male', 'Male'
    female = 'Female', 'Female'
    others = 'Others', 'Others'