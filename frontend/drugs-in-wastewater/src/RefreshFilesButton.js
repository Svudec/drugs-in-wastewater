import React from "react";
import { Button } from "antd";

const RefreshFilesButton = () => {

    const refreshFiles = () => {
        fetch('http://localhost:8400/api/v1/collection', {method: 'PUT'})
        .then(res => res.json().then(parsed => alert(parsed.message)))
    }

  return (
    <Button onClick={refreshFiles}>
      Osvježi datoteke
    </Button>
  );
};

export default RefreshFilesButton;