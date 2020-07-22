import React from "react";
import "./App.css";
import Navigation from "./components/Navigation/Navigation.js";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition.js";
import Logo from "./components/Logo/Logo.js";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm.js";
import Register from "./components/Register/Register.js";
import Signin from "./components/Signin/Signin.js";
import Rank from "./components/Rank/Rank.js";
import Particles from "react-particles-js";

const particalsOptions = {
  particles: {
    number: {
      value: 60,
      density: {
        enabled: true,
        value_area: 800,
      },
    },
  },
};

const initialState = {
  input: "",
  imageUrl: "",
  box: {},
  route: "signin",
  isSignedIn: false,
  user: {
    id: "",
    name: "",
    email: "",
    entries: 0,
    joined: "",
  },
};
class App extends React.Component {
  constructor() {
    super();
    this.state = initialState;
  }

  loadUser = (data) => {
    this.setState({
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined,
      },
    });
  };
  //HANDLE EVENTS

  handleInputChange = (event) => {
    this.setState({ input: event.target.value });
  };

  handleSubmit = () => {
    this.setState({ imageUrl: this.state.input });
    fetch("https://safe-spire-64190.herokuapp.com/imageurl", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input: this.state.input }),
    })
      .then((res) => res.json())
      .then((response) => {
        if (response) {
          fetch("https://safe-spire-64190.herokuapp.com/image", {
            method: "put",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: this.state.user.id }),
          })
            .then((res) => res.json())
            .then((count) => {
              this.setState(Object.assign(this.state.user, { entries: count }));
            })
            .catch(console.log);
        }
        this.displayFaceBox(this.calculateFaceLocation(response));
      })
      .catch((error) => console.log(error));
  };

  //ROUTING

  handleRouteChange = (route) => {
    if (route === "signout") {
      this.setState(initialState);
    } else if (route === "home") {
      this.setState({ isSignedIn: true });
    }
    this.setState({ route: route });
  };

  //FACE DETECTION BOX

  calculateFaceLocation = (data) => {
    const clarifaiFace =
      data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById("inputimage");
    const height = Number(image.height);
    const width = Number(image.width);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - clarifaiFace.right_col * width,
      bottomRow: height - clarifaiFace.bottom_row * height,
    };
  };

  displayFaceBox = (box) => {
    this.setState({ box: box });
  };

  //RENDERS

  render() {
    const { isSignedIn, imageUrl, route, box } = this.state;
    return (
      <div className="App">
        <Particles className="particles" params={particalsOptions} />
        <Navigation
          isSignedIn={isSignedIn}
          onRouteChange={this.handleRouteChange}
        />
        {route === "home" ? (
          <div>
            <Logo />
            <Rank
              name={this.state.user.name}
              entries={this.state.user.entries}
            />
            <ImageLinkForm
              onSubmit={this.handleSubmit}
              onInputChange={this.handleInputChange}
            />
            <FaceRecognition box={box} imageUrl={imageUrl} />
          </div>
        ) : route === "signin" ? (
          <Signin
            onRouteChange={this.handleRouteChange}
            loadUser={this.loadUser}
          />
        ) : (
          <Register
            onRouteChange={this.handleRouteChange}
            loadUser={this.loadUser}
          />
        )}
      </div>
    );
  }
}

export default App;
