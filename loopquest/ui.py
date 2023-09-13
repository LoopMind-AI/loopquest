def choose_instance():
    while True:
        print("\nChoose an app instance:")
        print("1. Cloud")
        print("2. Local")
        choice = input("Enter your choice (1/2): ").strip()

        if choice == "1":
            return "cloud"
        elif choice == "2":
            return "local"
        else:
            print("Invalid choice. Please choose 1 or 2.")
