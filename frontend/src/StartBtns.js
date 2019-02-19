import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import { withRouter } from "react-router-dom";

class StartBtns extends Component {
  render() {
    return (
      <div>
          <Button 
            color="inherit" 
            onClick={() => {
                this.props.history.push("/golist")
                }}
            >Start
        </Button>
      </div>
    );
  }
}
  
export default withRouter(StartBtns);
