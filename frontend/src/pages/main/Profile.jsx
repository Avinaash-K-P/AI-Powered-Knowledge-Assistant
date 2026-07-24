import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getProfile, updateProfile } from "../../services/profileService";
import "/src/styles/profile.css";

const Profile = () => {

const [profile, setProfile] = useState({

    username: "",

    email: ""

});

const [isEditing, setIsEditing] = useState(false);

const [loading, setLoading] = useState(false);

useEffect(() => {

    loadProfile();

}, []);

const loadProfile = async () => {

    try{

        const response = await getProfile();

        const profileData = {

            username: response.data.username,

            email: response.data.email

        }

        setProfile(profileData);

    }

    catch(error){

        console.log(error);

        toast.error("Failed to load profile.");

    }

};

const handleChange = (e) => {

    setProfile({

        ...profile,

        [e.target.name]: e.target.value

    });

};

const handleUpdate = async (e) => {

    e.preventDefault();

    try{

        setLoading(true);

        await updateProfile(profile);

        toast.success("Profile updated successfully.");

    }

    catch(error){

        toast.error("Profile update failed.");

    }

    finally{

        setLoading(false);

    }

};

return (

<div className="profile-page">

    <div className="profile-card">

        <h2>My Profile</h2>

        <p>
            Manage your account information.
        </p>

        <form onSubmit={handleUpdate}>

            {/* Username */}

            <div className="profile-group">

                <label>Username</label>

                {

                    isEditing ? (

                        <input
                            type="text"
                            className="form-control"
                            name="username"
                            value={profile.username}
                            onChange={handleChange}
                        />

                    ) : (

                        <div className="profile-value">

                            {profile.username}

                        </div>

                    )

                }

            </div>


            {/* Email */}

            <div className="profile-group">

                <label>Email</label>

                {

                    isEditing ? (

                        <input
                            type="email"
                            className="form-control"
                            name="email"
                            value={profile.email}
                            onChange={handleChange}
                        />

                    ) : (

                        <div className="profile-value">

                            {profile.email}

                        </div>

                    )

                }

            </div>


            {/* Buttons */}

            {

                isEditing ? (

                    <div className="profile-buttons">

                        <button
                            type="submit"
                            className="btn btn-success"
                            disabled={loading}
                        >

                            {

                                loading

                                ?

                                "Saving..."

                                :

                                "Save Changes"

                            }

                        </button>

                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => {

                                setIsEditing(false);

                                loadProfile();

                            }}
                        >

                            Cancel

                        </button>

                    </div>

                ) : (

                    <button
                        type="button"
                        className="btn btn-primary profile-update-btn"
                        onClick={() => setIsEditing(true)}
                    >

                        Update Profile

                    </button>

                )

            }

        </form>

    </div>

</div>

);

}

export default Profile;