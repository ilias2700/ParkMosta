import datetime
from werkzeug.security import generate_password_hash , check_password_hash
from flask import Flask, render_template, redirect , url_for , flash , request , jsonifyrequest
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from flask_migrate import Migrate
from models import db, InfoModel , Engine, User

from flask_sqlalchemy import SQLAlchemy
from forms import LoginForm, RegisterForm, RegisterReservasionForm, ReservationForm

app = Flask(__name__)
app.secret_key = "secret key"

app.config['SQLALCHEMY_DATABASE_URI'] = "postgresql://<username>:<password>@<server>:5432/<db_name>"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
 



@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('home_page'))

@app.route('/sign-up', methods=['GET' , 'POST'])
def sign_up():

    time_now = datetime.datetime.now()
    form = RegisterForm()
    if form.validate_on_submit():
        hashed_password = generate_password_hash(form.password.data , method='sha256')
        new_user = User(username= form.username.data, email=form.email.data, role = 'Client', phone = form.phone.data 
                        , password=hashed_password , created = time_now ,updated=time_now ) 
        db.session.add(new_user)
        db.session.commit()

        return redirect(url_for('page-parking'))
    return render_template('sign-up-page.html' , form=form)

@app.route('/sign-in', methods=['GET' , 'POST'])
def sign_in():
    form = LoginForm()

    if form.validate_on_submit():
        user = User.query.filter_by(username = form.username.data ).first()
        if user:
            if check_password_hash(user.password , form.password.data):
                login_user(user, remember=form.remember.data)

              
                return redirect(url_for('profile'))
            else:
                flash('Password incorrect !')
                return redirect(url_for('sign_in_page'))  
        
        if not user:
            flash('Username incorrect !')
            return redirect(url_for('sign_in_page'))

    return render_template('sign-in-page.html', form=form)


@app.route('/reservation', methods=['GET', 'post'])
def register():
    form = ReservationForm()
    if form.validate_on_submit():

    else:
        render_template('page-parking.html', form=form)
@app.route('/register-reservation', methods=['GET', 'post'])
def register_reservation():
    form = RegisterReservasionForm()
    if form.validate_on_submit():

    else :
        render_template('sign-in-page.html', form=form)
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')