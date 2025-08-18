import Select from "react-select"

export default function VoiceSelect({ narrate, voice, setVoice, voices = [] }) {
  const safeVoices = Array.isArray(voices) ? voices : []

  const options =
    safeVoices.length === 0
      ? [{ value: "", label: "Loading voices…" }]
      : safeVoices.map((v) => {
          const val = v.shortName || v.name
          const label = `${v.shortName || v.name} (${v.locale || "—"})`
          return { value: val, label }
        })

  const customStyles = {
    control: (base, state) => ({
      ...base,
      backgroundColor: "rgb(21,33,53)", // solid background
      fontFamily: "var(--ff-component-content)",
      border: "0px",
      opacity: narrate ? 1 : 0.5,
      boxShadow: state.isFocused ? "0 0 0 2px #4c9aff" : "none",
      "&:hover": { borderColor: "#4c9aff" },
      borderRadius: "1rem",
      padding: "0 1rem",
      fontSize: "var(--font-size-base)",
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: "rgb(30,45,70)", // fully opaque
      borderRadius: "8px",
      marginTop: 0,
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused
        ? "rgb(50,75,110)" // solid hover color
        : "rgb(30,45,70)", // same as menu background
      color: "white",
      cursor: "pointer",
      fontFamily: "var(--ff-component-content)",
      fontSize: "var(--font-size-base)",
    }),
    singleValue: (base) => ({
      ...base,
      color: "white",
    }),
    placeholder: (base) => ({
      ...base,
      color: "rgb(160, 170, 190)",
    }),
    dropdownIndicator: (base) => ({
      ...base,
      color: "white",
      "&:hover": { color: "#4c9aff" },
    }),
    menuList: (base) => ({
      ...base,
      backgroundColor: "rgb(30,45,70)",
    }),
  }

  return (
    <Select
      isDisabled={!narrate}
      value={options.find((opt) => opt.value === voice)}
      onChange={(selected) => setVoice(selected?.value || "")}
      options={options}
      styles={customStyles}
      placeholder="Select voice"
      title="Voice"
    />
  )
}
