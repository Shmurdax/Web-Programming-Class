import React from 'react';
import ProfileCard from './components/ProfileCard';
import './App.css';

// Import your images here
import druskiImg from './assets/Druski.jpg';
import joeImg from './assets/Joe Rogan.jpg';
import theoImg from './assets/Theo Von.jpg';

function App() {
  return (
    <div className="page-wrapper">
      <h1 className="title">Public Figures</h1>
      
      <div className="card-flex-container">
        {/* Profile 1: Druski */}
        <ProfileCard 
          name="Druski"
          occupation="Comedian & Entrepreneur"
          bio="Founder of Coulda Been Records and a digital creator known for his viral sketches and personalities."
          image={druskiImg}
          facebook="https://facebook.com/profile.php?id=61579390773520"
          instagram="https://instagram.com/druski"
          twitter="https://twitter.com/druski"
        />

        {/* Profile 2: Joe Rogan */}
        <ProfileCard 
          name="Joe Rogan"
          occupation="Podcaster & Comedian"
          bio="Host of The Joe Rogan Experience, a UFC commentator, and a veteran stand-up comedian."
          image={joeImg}
          facebook="https://facebook.com/joerogan"
          instagram="https://instagram.com/joerogan"
          twitter="https://twitter.com/joerogan"
        />

        {/* Profile 3: Theo Von */}
        <ProfileCard 
          name="Theo Von"
          occupation="Comedian & Podcaster"
          bio="A stand-up comedian and host of the This Past Weekend podcast."
          image={theoImg}
          facebook="https://facebook.com/theovon"
          instagram="https://instagram.com/theovon"
          twitter="https://twitter.com/theovon"
        />
      </div>
    </div>
  );
}

export default App;