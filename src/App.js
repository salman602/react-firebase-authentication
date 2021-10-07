import { getAuth, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail, updateProfile } from "firebase/auth";
import { useState } from "react";
import './App.css';
import firebaseInitialization from './Firebase/firebase.init';
import img from './images/download1.jpg';

firebaseInitialization();
const googleProvider = new GoogleAuthProvider();
function App() {
  const [user, setUser] = useState({});

  const auth = getAuth();
  const handleGoogleSignIn = () => {
    signInWithPopup(auth, googleProvider)
      .then((result) => {
        const { displayName, email, photoURL } = result.user;
        const userInfo = {
          name: displayName,
          email: email,
          photo: photoURL
        }
        setUser(userInfo);
      })
  };

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };


  const handleRegistration = (e) => {
    e.preventDefault();
    if (password.length < 6) {
      setError('Password should be at least 6 charecters.');
      return;
    }
    if (!/(?=.*[A-Z].*[A-Z])/.test(password)) {
      setError('Password Must contain at least two upper case.');
      return;
    }
    if (!/(?=.*[0-9].*[0-9])/.test(password)) {
      setError('Password must have two numbers');
      return;
    }


    isLoggedIn ? loggedInUser(email, password) : registerUser(email, password);


  };

  const registerUser = (email, password) => {
    createUserWithEmailAndPassword(auth, email, password)
      .then(result => {
        const user = result.user;
        console.log(user);
        setError('');
        verifyEmail();
        setUserName()

      })
      .catch(error => setError(error.message))
  };


  const setUserName = () => {
    updateProfile(auth.currentUser, { displayName: name })
      .then(result => { })
  };

  const loggedInUser = (email, password) => {
    signInWithEmailAndPassword(auth, email, password)
      .then((result) => {
        const user = result.user;
        console.log(user);
        setError('');
      })
      .catch(error => {
        setError(error.message)
      })
  };

  const toggle = (e) => {
    setIsLoggedIn(e.target.checked)
  };

  const verifyEmail = () => {
    sendEmailVerification(auth.currentUser)
      .then(result => {
        console.log(result);
      })
      .catch(error => {
        setError(error.message)
      })
  };



  const handleResetPassword = () => {
    sendPasswordResetEmail(auth, email)
      .then(result => {
        console.log(result);
      })
      .catch(err => {
        setError(err.message)
      })
  }

  return (
    <div className="">
      <h3 className="text-center text-primary">{isLoggedIn ? 'Login' : 'Register'} Here</h3>
      <form onSubmit={handleRegistration} className="w-75 mx-auto">
        {!isLoggedIn && <div className="row mb-3">
          <label htmlFor="inputName" className="col-sm-2 col-form-label">Name</label>
          <div className="col-sm-10">
            <input onBlur={handleNameChange} type="text" className="form-control" id="inputName" required />
          </div>
        </div>}
        <div className="row mb-3">
          <label htmlFor="inputEmail3" className="col-sm-2 col-form-label">Email</label>
          <div className="col-sm-10">
            <input onBlur={handleEmailChange} type="email" className="form-control" id="inputEmail3" required />
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="inputPassword3" className="col-sm-2 col-form-label">Password</label>
          <div className="col-sm-10">
            <input onBlur={handlePasswordChange} type="password" className="form-control" id="inputPassword3" required />
            <p className="text-danger">{error}</p>
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-sm-10 offset-sm-2">
            <div className="form-check">
              <input onChange={toggle} className="form-check-input" type="checkbox" id="gridCheck1" />
              <label className="form-check-label" htmlFor="gridCheck1">
                Already Registerd?
              </label>
            </div>
          </div>
        </div>
        <button type="submit" className="btn btn-primary">{isLoggedIn ? 'Login' : 'Register'}</button>
        <button onClick={handleResetPassword} type="button" className="btn btn-success ms-2">Reset Password</button>
      </form>
      <br /><br />
      <hr />
      <button onClick={handleGoogleSignIn} style={{ marginTop: '32px', cursor: 'pointer' }}><img width="50" src={img} alt="" /></button>

      {
        user.name && <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <img src={user.photo} alt="" />
          <h3><small>Name of the user is:</small> {user.name}</h3>
          <h4><small>Email of the user is:</small> {user.email}</h4>
        </div>
      }

    </div>
  );
}

export default App;
