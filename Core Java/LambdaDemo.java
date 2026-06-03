import java.util.*;

public class LambdaDemo {

    public static void main(String[] args) {

        List<String> names =
                Arrays.asList(
                        "John",
                        "David",
                        "Alex",
                        "Bob");

        Collections.sort(names,
                (a, b) -> a.compareTo(b));

        System.out.println(names);
    }
}