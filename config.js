// Configuration File
// Arquivo de configuração
module.exports = {
    port: 8088,
    databaseURI: "mongodb://localhost/mean",
    // Secret to generate JWT(Json Web Token), you can put any value here Eg: '231312', 'minhaChave', '237283jh2j3h'.
    // Chave secreta para gerar o JWT(Json Web Token), você pode colocar qualquer coisa Ex: '231312', 'minhaChave', '237283jh2j3h'.
    secret: 'mysecret',
    // Time for authentication token expires
    // Tempo para o token de autenticação expirar
    tokenExpireTime: 604800, // 1 Semana // 1 Week
    // Tamanho mínimo da senha
    passwordMinLength: 6,
    // Here you can define the error messages' content
    // Aqui você pode definir o conteúdo das mensagens de erro
    msgs:{
        invalidEmail: "Invalid e-mail",
        invalidName: "Invalid name",
        invalidPassword: "Invalid password",
        // Mensagem que é retornada quando o tamanho da senha é pequeno 
        weakPassword: `The Password is too weak, it need to have at least 6 characters`,
        userCreated: "User created",
        userSaveFailed: "There's a error during save process, try again!",
        // Mensagem que será retornada caso o e-mail que o usuário esteja tentando cadastrar já esteja em uso! 
        userAleadyExists: "This e-mail already is registered",
        userNotExists: "user doesn't exists",
        // Senha incorreta
        wrongPassword: "Wrong password!"
    }

}