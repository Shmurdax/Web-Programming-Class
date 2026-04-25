import React from 'react';

function ProfileCard(props) {
    return (
        <div className="profile-box">
            <div className="image-area">
                <img src={props.image} alt={props.name} />
            </div>

            <div className="info-area">
                <h2>{props.name}</h2>
                <p className="occupation">{props.occupation}</p>
                <p className="bio">{props.bio}</p>
            </div>

            <div className="social-links">
                <a href={props.facebook} target="_blank" className="link-btn facebook">Facebook</a>
                <a href={props.instagram} target="_blank" className="link-btn instagram">Instagram</a>
                <a href={props.twitter} target="_blank" className="link-btn twitter">Twitter</a>
            </div>
        </div>
    );
}

export default ProfileCard;