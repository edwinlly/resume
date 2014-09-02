DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3', # Add 'postgresql_psycopg2', 'mysql', 'sqlite3' or 'oracle'.
        'NAME': 'sqlite.db', # Or path to database file if using sqlite3.
        'USER': '', # Not used with sqlite3.
        'PASSWORD': '', # Not used with sqlite3.
        'HOST': '', # Set to empty string for localhost. Not used with sqlite3.
        'PORT': '', # Set to empty string for default. Not used with sqlite3.
    }
}
INSTALLED_APPS = (
    'resume.db.resumedb',
)

SECRET_KEY = 'gsc!vkgrq=vj4fb#%^qh9t0f3ayey@fp+&amp;r%c@$bn^-@mpwj7z'