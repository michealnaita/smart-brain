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
import Clarifai from "clarifai";

const app = new Clarifai.App({
  apiKey: "7c9e62e8f935466bae4bc095365edf10",
});
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
class App extends React.Component {
  constructor() {
    super();
    this.state = {
      input: "",
      imageUrl: "",
      box: {},
      route: "signin",
      isSignedIn: false,
    };
  }

  //HANDLE EVENTS

  handleInputChange = (event) => {
    this.setState({ input: event.target.value });
  };

  handleSubmit = () => {
    this.setState({ imageUrl: this.state.input });

    app.models
      .predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
      .then((response) =>
        this.displayFaceBox(this.calculateFaceLocation(response))
      )
      .catch((error) => console.log(error));
  };

  handleRouteChange = (route) => {
    if (route === "signout") {
      this.setState({ isSignedIn: false });
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
    console.log(box);
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
            <Rank />
            <ImageLinkForm
              onSubmit={this.handleSubmit}
              onInputChange={this.handleInputChange}
            />
            <FaceRecognition box={box} imageUrl={imageUrl} />
          </div>
        ) : route === "signin" ? (
          <Signin onRouteChange={this.handleRouteChange} />
        ) : (
          <Register onRouteChange={this.handleRouteChange} />
        )}
      </div>
    );
  }
}

export default App;
