import PropTypes from "prop-types";
import React from "react";

import "./autocomplete.css";

export const Autocomplete = ({ text, onChange, suggestions, onSuggestionHandler }) => {
  return (
    <div className="relative">
      <input className="form__input" type="text" onChange={(e) => onChange(e)} value={text} />
      {suggestions && (
        <div className="suggestions-container overflow-y-auto">
          {suggestions.map((suggestion, i) => (
            <div key={i} className="suggestion" onClick={() => onSuggestionHandler(suggestion)}>
              {suggestion.firstName} {suggestion.lastName}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

Autocomplete.propTypes = {
  text: PropTypes.string,
  onChange: PropTypes.func,
  onSuggestionHandler: PropTypes.func,
  suggestions: PropTypes.array,
};
