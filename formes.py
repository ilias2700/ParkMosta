# formes.py
from flask_wtf import FlaskForm , RecaptchaField 
from wtforms import StringField, PasswordField , BooleanField , TextAreaField , FormField , IntegerField , SelectField , SubmitField , FileField
from wtforms.validators import InputRequired , Email , Length 
from flask_wtf.file import  FileRequired



class LoginForm(FlaskForm):
    username = StringField('Username', validators=[InputRequired(), Length(min=4, max=50)])
    password = PasswordField('Password', validators=[InputRequired(), Length(min=8, max=80)])
    # remember = BooleanField('Remember me')

class RegisterForm(FlaskForm):
    email = StringField('E-mail', validators=[InputRequired(), Email(message='Invalid E-mail'), Length(max=50)])
    username = StringField('Username', validators=[InputRequired(), Length(min=5, max=15)])
    role = SelectField(u'role', choices=[('Client', 'Client') ,('Employe', 'Employe'), ('Admin', 'Admin') ])
    phone = StringField('Phone number' , validators=[InputRequired()])
    password = PasswordField('Password', validators=[InputRequired(), Length(min=8, max=80)])


class RegisterReservasionForm(FlaskForm):
    email = StringField('E-mail', validators=[InputRequired(), Email(message='Invalid E-mail'), Length(max=50)])
    username = StringField('Username', validators=[InputRequired(), Length(min=5, max=15)])
    name = StringField('Name', validators=[InputRequired(), Length(min=4, max=50)])
    role = SelectField(u'role', choices=[('Client', 'Client') ,('Employe', 'Employe'), ('Admin', 'Admin') ])
    phone = StringField('Phone number' , validators=[InputRequired()])
    password = PasswordField('Password', validators=[InputRequired(), Length(min=8, max=80)])

class ReservationForm(FlaskForm):
    ('id', 'matricule', 'owner_id', 'type', 'start_date', 'end_date', 'payment_amount', 'payed', )
    matricule = StringField('Matricule')
    type = SelectField(u'type', choices=[('voiture', 'voiture'), ( 'moto', 'moto' ), ('camion', 'camion')])
