const mockAccountModel = () => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any_email',
  password: 'any_password'
})

const AddAccountSpy = () => ({
  addAccountParams: null,
  account: mockAccountModel(),

  add(addAccountParams) {
    this.addAccountParams = addAccountParams

    return this.account
  }
})

const ValidationSpy = () => ({
  error: null,
  input: null,

  validate(input) {
    this.input = input

    return this.error
  }
})

const AuthenticationSpy = () => ({
  authenticationParams: null,
  account: mockAccountModel(),

  async auth(authenticationParams) {
    this.authenticationParams = authenticationParams

    return this.account
  }
})

module.exports = {
  mockAccountModel,
  ValidationSpy,
  AuthenticationSpy,
  AddAccountSpy
}
