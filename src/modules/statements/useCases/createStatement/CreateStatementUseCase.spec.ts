import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase"


enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

let statementsRepository: InMemoryStatementsRepository;
let usersRepository: InMemoryUsersRepository;
let createStatementUseCase: CreateStatementUseCase;

describe("Create Statement Use Case", () => {

	beforeEach(() => {
		statementsRepository = new InMemoryStatementsRepository();
		usersRepository = new InMemoryUsersRepository()
		createStatementUseCase = new CreateStatementUseCase(usersRepository, statementsRepository); 
	})

	it("Should be able to create a statement", async () => {
		const user = await usersRepository.create({
			name: "Thiago",
			email: "thiago@gmail.com",
			password: "1234"
		});

		const statement = await createStatementUseCase.execute({
			user_id: user.id as string,
			type: OperationType.DEPOSIT,
			description: "teste",
			amount: 100
		});

		expect(statement).toHaveProperty("id");
	})

	it("Should not be able to withdraw mora than the balance", () => {
		expect(async () => {
			const user = await usersRepository.create({
				name: "Thiago",
				email: "thiago@gmail.com",
				password: "1234"
			});

			const deposit = await createStatementUseCase.execute({
				user_id: user.id as string,
				type: OperationType.DEPOSIT,
				description: "teste",
				amount: 100
			});

			const withdraw = await createStatementUseCase.execute({
				user_id: user.id as string,
				type: OperationType.WITHDRAW,
				description: "test",
				amount: 200
			})

		}).rejects.toBeInstanceOf(CreateStatementError);
	})

	it("should not be able to make a statement for a inexisting user", () => {
		expect(async () => {
			await createStatementUseCase.execute({
				user_id: "28129",
				type: OperationType.DEPOSIT,
				description: "test",
				amount: 200
			})
		}).rejects.toBeInstanceOf(CreateStatementError)
	})
})