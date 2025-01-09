export const schema = {
  city: { defaultFunction: defaultCity, type: "string" },
  email: [
    {
      label: { defaultValue: "example label", required: true, type: "string" },
      value: { required: true, type: "string" },
    },
  ],
  hard_type: { allowedValues: "HARD_VALUE", defaultValue: "HARD_VALUE", required: true, type: "string" },
  id: { required: true, type: "string" },
  name: { defaultFunction: getName, required: true, type: "string" },
  notes: { type: "string", validationFunction: validateNotes },
  person_name: {
    first_name: { required: true, type: "string" },
    last_name: { defaultValue: "gentleman", type: "string" },
  },
  record_type: { allowedValues: "ORGANIZATION,PERSON", defaultValue: "PERSON", required: true, type: "string" },
  tags: [{ type: "string" }],
  work_details: {
    company: { type: "string" },
    job_title: { type: "string" },
  }
};

function getName(primitiveValue, schemaNode, baseObject) {
  return `${baseObject.PersonName.FirstName} ${baseObject.PersonName.LastName}`;
}

function validateNotes(primitiveValue, schemaNode, baseObject) {
  const MAX_LEN = 5;
  if (primitiveValue.length < MAX_LEN) {
    return "notes are too short!";
  }
  return true;
}

function defaultCity(primitiveValue, schemaNode, baseObject) {
  return "New Yourk";
}
