#include <iostream>
using namespace std;

int main() {
    for (int i = 0; i < 10; i++) {
        for (int j = 0; j <10-i; j++) printf(" ");
        for (int j = 0; j < 2*(i+1)-1; j++) printf("*");
        if (i == 2) printf("    ^^..");
        putchar('\n');
    }
    for (int i = 0; i < 3; i++) printf("         ***\n");

    return 0;
}