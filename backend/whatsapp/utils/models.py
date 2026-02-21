from django.db import models

class VisibleModel(models.Model):
    visible = models.BooleanField(default=True)

    class Meta:
        abstract = True


class TimeBasedModel(VisibleModel):
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True

class NameBasedModel(TimeBasedModel):
    name = models.CharField(max_length=255)

    class Meta:
        abstract = True