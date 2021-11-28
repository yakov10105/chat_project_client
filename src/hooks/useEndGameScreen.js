import React, { useEffect, useState } from "react";

const useEndGameScreen = title => {
  

  return (
      <>
        <h1>{title}</h1>
        <button>Back to Chat</button>
      </>
  );
};

export {useEndGameScreen};