// ❗ The ✨ TASKS inside this component are NOT IN ORDER.
// ❗ Check the README for the appropriate sequence to follow.
import React, {useState, useEffect} from 'react'
import axios from 'axios'
import * as yup from 'yup'

const e = { // This is a dictionary of validation error messages.
  // username
  usernameRequired: 'username is required',
  usernameMin: 'username must be at least 3 characters',
  usernameMax: 'username cannot exceed 20 characters',
  // favLanguage
  favLanguageRequired: 'favLanguage is required',
  favLanguageOptions: 'favLanguage must be either javascript or rust',
  // favFood
  favFoodRequired: 'favFood is required',
  favFoodOptions: 'favFood must be either broccoli, spaghetti or pizza',
  // agreement
  agreementRequired: 'agreement is required',
  agreementOptions: 'agreement must be accepted',
}

const formSchema = yup.object().shape({
  username: yup
.string().trim()
.min(3, e.usernameMin)
.max(20, e.usernameMax)
.required(e.usernameRequired),
favLanguage: yup
.string()
.required(e.favLanguageRequired).trim()
.oneOf(["javascript", "rust"], e.favLanguageOptions),
favFood: yup.string()
.oneOf(["pizza", "spaghetti", "broccoli"],e.favFoodOptions)
.required(e.favFoodRequired).trim(),
agreement: yup
.boolean()
.oneOf([true], e.agreementOptions)
.required(e.agreementRequired),


})
const initialValue = () => (
  {username: "", favLanguage: "", favFood: " ", agreement: false}
)
// ✨ TASK: BUILD YOUR FORM SCHEMA HERE
// The schema should use the error messages contained in the object above.
const initialValueErr = () => (
  {username: "", favLanguage: "", favFood: " ", agreement: ''}
)
export default function App() {
  
  const [values, setValues] = useState(initialValue())
  const [error, setError] = useState(initialValueErr())
  const [success, setSuccess] = useState()
  const [failure, setFailure] = useState()
  const [enabled, setEnabled] = useState(false)
  // ✨ TASK: BUILD YOUR STATES HERE
  // You will need states to track (1) the form, (2) the validation errors,
  // (3) whether submit is disabled, (4) the success message from the server,
  // and (5) the failure message from the server.


 

  // ✨ TASK: BUILD YOUR EFFECT HERE
  // Whenever the state of the form changes, validate it against the schema
  // and update the state that tracks whether the form is submittable.
useEffect(() => {


  formSchema.isValid(values)
  .then(valid => {
    setEnabled(valid)
  })

},[values])



  const onChange = evt => {
    let {type, checked, name, value} = evt.target
    if(type === "checkbox") value = checked

    setValues({...values, [name]: value})
    // ✨ TASK: IMPLEMENT YOUR INPUT CHANGE HANDLER
    // The logic is a bit different for the checkbox, but you can check
    // whether the type of event target is "checkbox" and act accordingly.
    // At every change, you should validate the updated value and send the validation
    // error to the state where we track frontend validation errors.
    yup.reach(formSchema, name).validate(value)
    .then(() => {
      setError({ ...error, [name]: "" }); // Clear error if valid
    })
    .catch(err => {
      setError({ ...error, [name]: err.errors[0] }); // Set custom error message
    });
  }

  const onSubmit = evt => {
    evt.preventDefault()
    
axios.post(`https://webapis.bloomtechdev.com/registration`, values)
.then(res=> {
setSuccess(res.data.message)
setFailure()
setValues(initialValue)
 })
.catch(err => {
setSuccess()
setFailure(err.response.data.message)

})


    // ✨ TASK: IMPLEMENT YOUR SUBMIT HANDLER
    // Lots to do here! Prevent default behavior, disable the form to avoid
    // double submits, and POST the form data to the endpoint. On success, reset
    // the form. You must put the success and failure messages from the server
    // in the states you have reserved for them, and the form
    // should be re-enabled.
  }

  return (
    <div> {/* TASK: COMPLETE THE JSX */}
      <h2>Create an Account</h2>
      <form onSubmit={onSubmit}>
       {success &&<h4 className="success">{success}</h4>}
        {failure && <h4 className="error">{failure}</h4>}

        <div className="inputGroup">
          <label htmlFor="username">Username:</label>
          <input id="username" name="username" type="text" placeholder="Type Username" onChange={onChange} value={values.username}/>
          {error.username && <div className="validation">{error.username}</div>}
        </div>

        <div className="inputGroup">
          <fieldset>
            <legend>Favorite Language:</legend>
            <label>
              <input onChange={onChange} type="radio" name="favLanguage" value="javascript" checked={values.favLanguage === "javascript"}/>
              JavaScript
            </label>
            <label>
              <input onChange={onChange} type="radio" name="favLanguage" value="rust" checked={values.favLanguage === "rust"} />
              Rust
            </label>
          </fieldset>
         {error.favLanguage && <div className="validation">{error.favLanguage}</div>}
        </div>

        <div className="inputGroup">
          <label htmlFor="favFood">Favorite Food:</label>
          <select onChange={onChange} id="favFood" name="favFood" value={values.favFood}>
            <option value="">-- Select Favorite Food --</option>
            <option value="pizza">Pizza</option>
            <option value="spaghetti">Spaghetti</option>
            <option value="broccoli">Broccoli</option>
          </select>
          {error.favFood && <div className="validation">{error.favFood}</div>}
        </div>

        <div className="inputGroup">
          <label>
            <input onChange={onChange} id="agreement" type="checkbox" name="agreement" checked={values.agreement}/>
            Agree to our terms
          </label>
         {error.agreement && <div className="validation">{error.agreement}</div>}
        </div>

        <div>
          <input type="submit" disabled={!enabled} />
        </div>
      </form>
    </div>
  )
}
