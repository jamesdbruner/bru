export const formatResponse = (response: string) => {
  return response.split(/(\[bru\]:|\[ai\]:)/g).map((segment, index) => {
    if (segment === '[bru]:' || segment === '[ai]:') {
      return (
        <span key={index}>
          {index > 1 && <br />}
          <span className="text-white font-semibold">{segment}</span>
        </span>
      );
    }
    return (
      <span key={index}>
        {segment}
      </span>
    );
  });
};

export default formatResponse