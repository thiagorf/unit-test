import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase"

let authenticateUserUseCase: AuthenticateUserUseCase;
let usersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Authenticate User Use Case", () => {
	beforeEach(() => {
		usersRepository = new InMemoryUsersRepository();
		authenticateUserUseCase = new AuthenticateUserUseCase(usersRepository);
		createUserUseCase = new CreateUserUseCase(usersRepository);
	})

	it("Should be able to authenticate a user", async () => {

		const userData = {
			name: "Thiago",
			email: "thiago@gmail.com",
			password: "1234"
		}

		const newUser = await createUserUseCase.execute(userData);
		
		console.log(newUser)
		const response = await authenticateUserUseCase.execute({
			email: userData.email,
			password: userData.password
		}); 

		expect(response).toHaveProperty("token");
		expect(response).toHaveProperty("user");
	})
})