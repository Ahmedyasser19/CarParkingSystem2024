let clock = {};
// loop 24 times for each clock hour
for (let i = 0; i < 25; i++) {
  let temp = i < 10 ? "0" : "";
  clock[temp + i] = true; // or set it to any default value you want
}

// Now `clock` is an object with keys representing each hour
// You can access each hour using its key
for (const hour in clock) {
  console.log(hour);
}
