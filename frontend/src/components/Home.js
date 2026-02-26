import './Home.css'
import Layout from "./partials/Layout";

const Home = ({ setIsLoggedIn }) => {
  return (
    <Layout setIsLoggedIn={setIsLoggedIn}>
      <div className="home__container">
        <div className="home__intro">
          <h3>Welcome to Allieva Pharma Chat Application</h3>
          <p>
            A scalable real-time messaging solution built using Django Channels and modern React architecture.
          </p>
          <div className="home__about">
  					<p>
    					Architected and developed by <b>Avinash (Backend Developer)</b>, focusing on
    					asynchronous processing, <br /> WebSocket communication, and API-driven design.
  					</p>
  					<p>
    					The platform ensures secure internal communication with efficient
    					state management <br />and real-time data synchronization.
  					</p>
					</div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
