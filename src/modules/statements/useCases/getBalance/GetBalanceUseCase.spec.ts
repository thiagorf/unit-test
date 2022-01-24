import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { GetBalanceUseCase } from "./GetBalanceUseCase";


let statementsRepository: InMemoryStatementsRepository;
let usersRepository: InMemoryUsersRepository;
let getBalanceUseCase: GetBalanceUseCase;

describe("Get Balance Use Case", () => {
	beforeEach(() => {
		statementsRepository =  new InMemoryStatementsRepository();
		usersRepository = new InMemoryUsersRepository();
		getBalanceUseCase = new GetBalanceUseCase(statementsRepository, usersRepository);
	})

	it("Should be able to get balance", async () => {
		const user = await usersRepository.create({
			name: "Thiago",
			email: "thiago@gmail.com",
			password: "1234"
		});
		
		const response = await getBalanceUseCase.execute({
			user_id: user.id as string
		});

		expect(response).toHaveProperty("statement")
		expect(response).toHaveProperty("balance")
	});

	it("Should not be able to get balance for a inexisting user", () => {
		expect(async () => {

			const response = await getBalanceUseCase.execute({
				user_id: "1234"
			});
		}).rejects.toBeInstanceOf(AppError)
	});
	
})