class Car {

    String make;
    String model;
    int year;

    void displayDetails() {
        System.out.println("Make : " + make);
        System.out.println("Model: " + model);
        System.out.println("Year : " + year);
    }
}

public class CarDemo {

    public static void main(String[] args) {

        Car c1 = new Car();

        c1.make = "Toyota";
        c1.model = "Camry";
        c1.year = 2024;

        c1.displayDetails();
    }
}