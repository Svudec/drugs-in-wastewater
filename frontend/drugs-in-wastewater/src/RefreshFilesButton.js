import React from "react";
import { Button } from "antd";

const LogoutButton = () => {

    const refreshFiles = () => {
        fetch('http://localhost:8400/api/v1/collection', {method: 'PUT'})
        .then(res => res.json().then(parsed => setData(parsed.res)))
    }

  return (
    <Button onClick={() => logout({ returnTo: window.location.origin })}>
      Osvježi datoteke
    </Button>
  );
};

export default LogoutButton;