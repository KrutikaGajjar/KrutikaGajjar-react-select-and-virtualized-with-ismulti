import React, {useState, useEffect} from "react";
import Select from "react-select";
import { List } from "react-virtualized";
import "./dropdown.css"

const MenuList = (props) => {
    const rows = props.children;
    const rowRenderer = ({ key, index, isScrolling, isVisible, style }) => (
      <div key={key} style={style}>
        {rows[index]}
      </div>
    );
  
    return (
      <List
        style={{ width: "100%" }}
        width={1900}
        height={300}
        rowHeight={30}
        rowCount={rows.length}
        rowRenderer={rowRenderer}
      />
    );
  };

const Dropdown = () => {
    const [data, setData] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetch("dropdown.json", {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
          }
        });
        const mydata = await response.json();
        setData(mydata[0].data);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    getData();
  }, []);

  const handleCountClick = (event) => {
    event.stopPropagation();
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };
  const Popup = () => (
    <div className="popup-overlay">
      <div className="popup-content">
        <h3>List</h3>
        <ul>
          <li>Item 1</li>
          <li>Item 2</li>
          <li>Item 3</li>
        </ul>
        <button onClick={handleClosePopup}>Close</button>
      </div>
    </div>
  );

  const options = data.flatMap((item) => [
    {
      label: item.label
    },
    ...item.options.map((option) => ({
      label: option.label,
      value: option.key,
      count: option.count
    }))
  ]);

  const [hoveredOption, setHoveredOption] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const formatOptionLabel = ({ label, count }) => (
    <div
      className="option-container"
      onMouseEnter={() => setHoveredOption(label)}
      onMouseLeave={() => setHoveredOption(null)}
    >
      <span>{label}</span>
      {hoveredOption === label && (
        <span onClick={handleCountClick}>- {count}</span>
      )}
    </div>
  );
  return (
    <div style={{ width: "100%" }}>
      <Select
        components={{ MenuList }}
        options={options}
        formatOptionLabel={formatOptionLabel}
        isMulti
      />
      {isPopupOpen && (
        <>
          <div className="backdrop" />
          <div className="popup-container">
            <Popup />
          </div>
        </>
      )}
    </div>
  );
};

export default Dropdown;
