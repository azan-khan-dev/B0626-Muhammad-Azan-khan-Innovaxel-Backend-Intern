const errorHandler = (err, req, res, next) => {
  let file = null;
  let line = null;
  let column = null;

  if (err.stack) {
    const stackLines = err.stack.split("\n");

    for (const lineStr of stackLines) {
     
      let match = lineStr.match(/(file:\/\/\/.*):(\d+):(\d+)/);

      if (!match) {
        match = lineStr.match(/\((.*):(\d+):(\d+)\)/);
      }

      if (match) {
        file = match[1];
        line = match[2];
        column = match[3];
        break;
      }
    }
  }

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message,
    file,
    line,
    column,
  });
};

export default errorHandler;