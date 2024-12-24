import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../config/firebase';
import { 
    GoogleAuthProvider, 
    FacebookAuthProvider,
    signInWithPopup
} from 'firebase/auth';
import 'bootstrap/dist/css/bootstrap.min.css';

const ParentRegistration: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleGoogleSignIn = async () => {
        setLoading(true);
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            
            // Get the ID token
            const idToken = await result.user.getIdToken();
            
            // Send the user data to your backend
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/register-parent`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    idToken,
                    email: result.user.email,
                    displayName: result.user.displayName,
                    provider: 'google'
                })
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('parentToken', data.token);
                navigate('/parent-dashboard');
            }
        } catch (error) {
            console.error('Google sign-in error:', error);
            alert('Failed to sign in with Google. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleFacebookSignIn = async () => {
        setLoading(true);
        try {
            const provider = new FacebookAuthProvider();
            const result = await signInWithPopup(auth, provider);
            
            // Get the ID token
            const idToken = await result.user.getIdToken();
            
            // Send the user data to your backend
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/register-parent`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    idToken,
                    email: result.user.email,
                    displayName: result.user.displayName,
                    provider: 'facebook'
                })
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('parentToken', data.token);
                navigate('/parent-dashboard');
            }
        } catch (error) {
            console.error('Facebook sign-in error:', error);
            alert('Failed to sign in with Facebook. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-4">
                    <h2 className="text-center mb-4">Parent Registration</h2>
                    <div className="d-grid gap-3">
                        <button 
                            className="btn btn-danger w-100"
                            onClick={handleGoogleSignIn}
                            disabled={loading}
                        >
                            <i className="fab fa-google me-2"></i>
                            Continue with Google
                        </button>
                        <button 
                            className="btn btn-primary w-100"
                            onClick={handleFacebookSignIn}
                            disabled={loading}
                        >
                            <i className="fab fa-facebook-f me-2"></i>
                            Continue with Facebook
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ParentRegistration; 