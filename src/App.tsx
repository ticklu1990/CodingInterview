import * as React from "react";
import axios from "axios";
import { useRef } from "react";
//import "./styles.css";

const { useEffect, useState } = React;

const getFullUserName = (userInfo: UserInfo) => {
  const {
    name: { first, last }
  } = userInfo;
  return `${first} ${last}`;
};

interface UserName {
  first: string;
  last: string;
  title: string;
}

interface UserPicture {
  thumbnail: string;
}

interface UserInfo {
  name: UserName;
  picture: UserPicture;
}

const fetchRandomData = (pageNumber: number) => {
  return axios
    .get(`https://randomuser.me/api?page=${pageNumber}`)
    .then(({ data }) => {
      console.log(data);
      return data;
    })
    .catch((err) => {
      console.error(err);
    });
};

export default function App() {
  const [counter, setCounter] = useState(0);
  const [nextPageNumber, setNextPageNumber] = useState(1);
  const [userInfos, setUserInfos] = useState([]);
  const [randomeUserDataJSON, setRandomUserDataJSON] = useState(" ");

  const fetchNextUser = useRef(() => {});

  fetchNextUser.current = () => {
    fetchRandomData(nextPageNumber).then((randomData) => {
      // setRandomUserDataJSON(
      //   JSON.stringify(randomData, null, 2) || "No user Data Found"
      // );
      if (randomData === undefined) return;
      const newUserInfos = [...userInfos, ...randomData.results];
      setUserInfos(newUserInfos);
      setNextPageNumber(randomData.info.page + 1);
    });
  };

  useEffect(() => {
    fetchNextUser.current();
  }, []);

  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
      <p>{counter}</p>
      <button
        onClick={() => {
          setCounter(counter + 1);
          console.log("f00");
        }}
      >
        Increase Counter
      </button>
      <button
        onClick={() => {
          fetchNextUser.current();
        }}
      >
        Fetch Next User
      </button>

      {userInfos.map((userInfo: UserName, idx: number) => (
        <div key={idx}>
          <p>{getFullUserName(userInfo)}</p>;
          <img src={userInfo.picture.thumbnail} />
        </div>
      ))}

      {/* <pre>{randomeUserDataJSON}</pre> */}
    </div>
  );
}
