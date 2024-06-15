// this functions return rows for the calendar

const CalandarButton = ({
  daysToSkip,
  daysInMonth,
  monthObj,
  nav,
  today,
  setDate,
}) => {
  let counter = 1;
  let dateValue = new String(monthObj).split(" ");

  function printRows() {
    let rows = [];
    for (let row = 0; row < 5; row++) {
      let cells = [];
      for (let i = 0; i < 7; i++) {
        if (i < daysToSkip && row === 0) {
          cells.push(
            <td
              key={`${i}-${row}`}
              data-value=""
              className="not-active-cell"
            ></td>
          );
        } else if (counter > daysInMonth) {
          cells.push(
            <td
              key={`${i}-${row}`}
              data-value=""
              className="not-active-cell"
            ></td>
          );
        } else {
          let dValue = dateValue[0] + " " + counter + ", " + dateValue[2];
          cells.push(
            <td
              key={`${i}-${row}`}
              data-value={dValue}
              className={`cell-with-data 
              ${nav == 0 && counter == today ? "todayDate" : ""}
              ${nav == 0 && counter < today ? "disabledCells" : ""}
              ${nav < 0 ? "disabledCells" : ""}
              `}
              onClick={() => {
                setDate(dValue);
              }}
            >
              {counter}
            </td>
          );
          counter++;
        }
      }
      rows.push(<tr key={row}>{cells}</tr>);
    }
    return rows;
  }

  return <>{printRows()}</>;
};

export default CalandarButton;
