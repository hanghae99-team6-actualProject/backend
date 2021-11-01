const doAdd = (a, b, callback) => {
  callback(a + b);
};

test("calls callback with arguments added", () => {
  const mockCallback = jest.fn();
  doAdd(1, 2, mockCallback);
  expect(mockCallback).toHaveBeenCalledWith(3);
});




// test("returns undefined by default", () => {
//   const mock = jest.fn();
//   let result = mock("원하는 값");

//   console.log(mock);
//   console.log(result);

//   expect(result).toBeUndefined();
//   expect(mock).toHaveBeenCalled();
//   expect(mock).toHaveBeenCalledTimes(1);
//   expect(mock).toHaveBeenCalledWith("원하는 값");
// });

// test("mock implementation", () => {
//   const mock = jest.fn(() => "bar");

//   expect(mock("foo")).toBe("bar");
//   expect(mock).toHaveBeenCalledWith("foo");
// });

// test("also mock implementation", () => {
//   const mock = jest.fn().mockImplementation(() => "bar");

//   expect(mock("foo")).toBe("bar");
//   expect(mock).toHaveBeenCalledWith("foo");
// });

// test("mock implementation one time", () => {
//   const mock = jest.fn().mockImplementationOnce(() => "bar");

//   expect(mock("foo")).toBe("bar");
//   expect(mock).toHaveBeenCalledWith("foo");

//   expect(mock("baz")).toBe(undefined);
//   expect(mock).toHaveBeenCalledWith("baz");
// });

// test("mock return value", () => {
//   const mock = jest.fn();
//   mock.mockReturnValue("bar");

//   expect(mock("foo")).toBe("bar");
//   expect(mock).toHaveBeenCalledWith("foo");
// });

// test("mock promise resolution", () => {
//   const mock = jest.fn();
//   mock.mockResolvedValue("bar");

//   expect(mock("foo")).resolves.toBe("bar");
//   expect(mock).toHaveBeenCalledWith("foo");
// });