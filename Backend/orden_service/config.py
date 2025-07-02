import os

class Config:
    SQLALCHEMY_DATABASE_URI = 'sqlite:///ordenes.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    RABBITMQ_HOST = 'localhost'
    RABBITMQ_USER = 'admin'  # 👈
    RABBITMQ_PASS = 'admin'  # 👈
