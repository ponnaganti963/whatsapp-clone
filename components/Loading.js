import styled from "styled-components";
// import { Circle } from "better-react-spinkit";
function Loading() {
    return (
        <div style={{ display: "grid", placeItems: "center", height: "100vh"}}>

            <img  
                src="http://assets.stickpng.com/images/580b57fcd9996e24bc43c543.png"
                alt=""
                style = {{marginBottom: 10}}
                height ={200}
                />
                {/* <Circle color="#3cbc2b" size={60}/> */}

        </div>
    )
}

export default Loading;

