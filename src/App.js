import "./App.css";
import React, { useRef, useEffect, useState } from "react";
import discArt from "./assets/disc.png";
import backgroundArt from "./assets/background.jpg";
import ColorThief from "colorthief";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBackward,
  faForward,
  faHeart,
  faInfinity,
  faPause,
} from "@fortawesome/free-solid-svg-icons";
import "./styles.css";
function App() {
  const fileInputRef = useRef(null);
  const audioRef = useRef(null);
  const canvasRef = useRef(null);
  const [backgroundColor, setBackgroundColor] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [palettes, setPalettes] = useState([]);
  const [artists, setArtists] = useState("");
  const [song, setSong] = useState([]);
  useEffect(() => {
    const fileInput = fileInputRef.current;
    const audio = audioRef.current;
    const canvas = canvasRef.current;

    fileInput.onchange = () => {
      const context = new AudioContext();
      const files = fileInput.files;
      let fileName = files[0].name;

      // Remove the file extension
      let nameWithoutExtension = fileName.replace(".mp3", "");

      // Split the string by " - "
      let parts = nameWithoutExtension.split(" - ");

      setArtists("ㅤ");
      setSong("ㅤ");
      audio.src = URL.createObjectURL(files[0]);
      audio.load();
      audio.play();

      const src = context.createMediaElementSource(audio);
      const analyser = context.createAnalyser();

      const ctx = canvas.getContext("2d");
      const WIDTH = canvas.width;
      const HEIGHT = canvas.height;

      src.connect(analyser);
      analyser.connect(context.destination);

      analyser.fftSize = 256;

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      const barWidth = (WIDTH / bufferLength) * 3.25;

      function renderFrame() {
        requestAnimationFrame(renderFrame);

        let x = 0;
        analyser.getByteFrequencyData(dataArray);

        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, WIDTH, HEIGHT);

        for (let i = 0; i < bufferLength; i++) {
          const barHeight = dataArray[i];
          ctx.fillStyle = `rgb(255, 255, 255)`;
          ctx.fillRect(x, HEIGHT - barHeight + 120, barWidth, barHeight);

          x += barWidth + 1;
        }
      }

      audio.play();
      renderFrame();
    };
  }, [backgroundColor]);

  const uploadImage = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = async (event) => {
      const img = new Image();

      // Wait for image to load
      img.onload = () => {
        const colorThief = new ColorThief();
        const colorPalette = colorThief.getPalette(img, 6);
        setUploadedImage(event.target.result);
        setPalettes(colorPalette);
      };
      img.src = event.target.result;
    };

    reader.readAsDataURL(file);
  };

  function rgbToHex([r, g, b]) {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b)
      .toString(16)
      .slice(1)
      .toUpperCase()}`;
  }

  const handleSetBackgroundColor = (palette) => {
    console.log(palette);
    setBackgroundColor(palette);
  };
  return (
    <div
      className="App"
      style={{
        backgroundColor: "#3C3C3C",
        margin: 0,
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* 393 x 851 PX */}
      <div
        className="content background-animation"
        style={{
          height: 900,
          width: 472,
          padding: 15,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 10,
          backgroundColor:
            backgroundColor !== null ? backgroundColor : "transparent",
          transform: "rotate(90deg)",
          marginTop: 80,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 5,
            width: "70%",
            alignItems: "center",
          }}
        >
          <div
            style={{
              height: 302,
              width: 472,
              position: "absolute",
              top: 122,
              zIndex: -1,
              left: 14,
              border: "2px solid #fff",
              borderRadius: 10,
              // borderTop: 0,
            }}
          ></div>
          <div
            style={{
              height: "91.5%",
              width: "50%",
              zIndex: 2,
              transform: "translateX(25%)",
              display: "flex",
              border: "2px solid #fff",
              padding: 5,
              paddingRight: 0,
              borderRight: 0,
              borderBottomLeftRadius: 10,
              borderTopLeftRadius: 10,
            }}
          >
            <div
              style={{
                height: "10%",
                width: 80,
                backgroundColor: backgroundColor,
                position: "absolute",
                left: 0,
                top: "45%",
              }}
            ></div>
          </div>
          <div
            style={{
              width: "50%",
              border: "2px solid #fff",
              borderLeft: 0,
              borderTopRightRadius: "50%",
              borderBottomRightRadius: "50%",
              zIndex: 1,
              transform: "translateX(-30%)",
              display: "flex",
              padding: 5,
              backgroundColor: backgroundColor,
            }}
          >
            <img
              src={discArt}
              alt="disc-image"
              style={{
                width: "100%",
              }}
              className="spin-infinite"
            ></img>
          </div>
        </div>
        <canvas
          id="canvas"
          ref={canvasRef}
          style={{
            width: "95%",
            zIndex: 1000,
            height: 200,
            paddingBottom: 15,
          }}
        ></canvas>

        {uploadedImage && (
          <div
            className="info"
            style={{
              background: "rgba(0, 0, 0, 0.45)",
              borderRadius: 10,
              boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
              backdropFilter: "blur(5px)",
              WebkitBackdropFilter: "blur(5px)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              alignSelf: "stretch",
              padding: 15,
              gap: 7,
              paddingBottom: 15,
              paddingTop: 10,
            }}
          >
            <div
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                height: "100%",
                gap: 5,
                alignItems: "center",
                marginTop: 5,
              }}
            >
              {/* on off */}
              {/* <img
                src={backgroundArt}
                alt="disc-image"
                style={{
                  width: "100%",
                  borderRadius: 10,
                  zIndex: 1,
                }}
              ></img> */}
              {/* on off */}
              <div style={{ height: 295, width: "100%" }}></div>
              <h3
                style={{
                  margin: 0,
                  color: "#fff",
                  fontWeight: 500,
                  textShadow: "rgba(255, 255, 255, .7) 5  40px",
                }}
              >
                {song}
              </h3>
              <h4 style={{ margin: 0, color: "#ccc", fontWeight: 500 }}>
                {artists}
              </h4>
              <div
                className="controller-bar"
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 40,
                  overflow: "hidden",
                  height: 40,
                  width: "90%",
                }}
              >
                <div className="pacman"></div>
                <div
                  className="path"
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    backgroundColor: "#ccc",
                    zIndex: 2,
                  }}
                ></div>
                <div
                  style={{
                    width: "60%",
                    height: 5,
                    backgroundColor:
                      backgroundColor !== null
                        ? backgroundColor
                        : "transparent",
                    position: "absolute",
                    left: "51%",
                    transform: "translateX(-50%)",
                    zIndex: 1,
                    borderRadius: 5,
                  }}
                ></div>
                <FontAwesomeIcon icon={faInfinity} color="#ccc" size="sm" />
              </div>
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: 5,
                  gap: 35,
                }}
              >
                <FontAwesomeIcon icon={faBackward} color="#fff" size="lg" />
                <FontAwesomeIcon icon={faPause} color="#fff" size="lg" />
                <FontAwesomeIcon icon={faForward} color="#fff" size="lg" />
                <FontAwesomeIcon
                  icon={faHeart}
                  color="#fff"
                  size="lg"
                  className="heartbeat"
                />
              </div>
            </div>
          </div>
        )}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
          position: "absolute",
          right: 0,
          top: 0,
          zIndex: 1000,
        }}
      >
        <input
          type="file"
          id="thefile"
          ref={fileInputRef}
          placeholder="EnterImport mp3 File"
        ></input>
        <audio
          id="audio"
          oncontextmenu="return false;"
          controls
          controlslist="nodownload"
          ref={audioRef}
        ></audio>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
          position: "absolute",
          left: 0,
          zIndex: 1000,
          top: 0,
        }}
      >
        <input type="file" id="coverArtFile" onChange={uploadImage} />
        <div
          style={{
            width: "100%",
            height: 50,
            display: "flex",
          }}
        >
          {palettes.map((palette, index) => {
            const hexColor = rgbToHex(palette);
            return (
              <div
                key={index}
                palette={palette}
                style={{ height: 50, width: 50, backgroundColor: hexColor }}
                onClick={() => handleSetBackgroundColor(hexColor)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default App;
