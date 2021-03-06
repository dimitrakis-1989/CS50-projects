/**
 * resize.c
 *
 * Computer Science 50
 * Problem Set 4
 *
 * resizes a BMP by n times
 */
       
#include <stdio.h>
#include <stdlib.h>

#include "bmp.h"

int main(int argc, char* argv[])
{
    // ensure proper usage
    if (argc != 4)
    {
        printf("Usage: ./resize n infile outfile\n");
        return 1;
    }

    // remember filenames
    int res_fac = atoi(argv[1]);
    char* infile = argv[2];
    char* outfile = argv[3];
    int rep;
    
    // open input file 
    FILE* inptr = fopen(infile, "r");
    if (inptr == NULL)
    {
        printf("Could not open %s.\n", infile);
        return 2;
    }

    // open output file
    FILE* outptr = fopen(outfile, "w+");
    if (outptr == NULL)
    {
        fclose(inptr);
        fprintf(stderr, "Could not create %s.\n", outfile);
        return 3;
    }

    // read infile's BITMAPFILEHEADER
    BITMAPFILEHEADER bf;
    fread(&bf, sizeof(BITMAPFILEHEADER), 1, inptr);
   
    
    // read infile's BITMAPINFOHEADER
    BITMAPINFOHEADER bi;
      
    fread(&bi, sizeof(BITMAPINFOHEADER), 1, inptr);
    
    int init_width = bi.biWidth;
    int init_height = bi.biHeight;
    
    
    bi.biWidth = bi.biWidth * res_fac;
    bi.biHeight = bi.biHeight * res_fac;
 

    // ensure infile is (likely) a 24-bit uncompressed BMP 4.0
    if (bf.bfType != 0x4d42 || bf.bfOffBits != 54 || bi.biSize != 40 || 
        bi.biBitCount != 24 || bi.biCompression != 0)
    {
        fclose(outptr);
        fclose(inptr);
        fprintf(stderr, "Unsupported file format.\n");
        return 4;
    }
    
     // determine padding for scanlines
    int init_padding =  (4 - (init_width * sizeof(RGBTRIPLE)) % 4) % 4;
    int padding =  (4 - (bi.biWidth * sizeof(RGBTRIPLE)) % 4) % 4;
    
    
    bi.biSizeImage = ((bi.biWidth * 3) + padding) * abs(bi.biHeight);
    bf.bfSize = bi.biSizeImage + 54;
    
    // write outfile's BITMAPFILEHEADER
    fwrite(&bf, sizeof(BITMAPFILEHEADER), 1, outptr);

    // write outfile's BITMAPINFOHEADER
    fwrite(&bi, sizeof(BITMAPINFOHEADER), 1, outptr);

   
    
    char scan[3 * bi.biWidth + padding];

    // iterate over infile's scanlines
    for (int i = 0, biHeight = abs(init_height); i < biHeight; i++)
    {
        // iterate over pixels in scanline
        for (int j = 0; j < init_width; j++)
        {
            // temporary storage
            RGBTRIPLE triple;

            // read RGB triple from infile
            fread(&triple, sizeof(RGBTRIPLE), 1, inptr);

            // write RGB triple to outfile
            for (int z = 0; z < res_fac; z++)
             {   
                fwrite(&triple, sizeof(RGBTRIPLE), 1, outptr);
             }
        }

        // skip over padding, if any
        fseek(inptr, init_padding, SEEK_CUR);

        // then add it back (to demonstrate how)
        for (int k = 0; k < padding; k++)
        {
            fputc(0x00, outptr);
        }
        rep = 1;
        while (rep < res_fac)
        {
            fseek(outptr, -(3 * bi.biWidth + padding), SEEK_CUR);
            fread(&scan, 3 * bi.biWidth + padding, 1, outptr);
            fwrite(&scan, 3 * bi.biWidth + padding, 1, outptr);
            
            rep++;
        }    
    }
    
    

    // close infile
    fclose(inptr);

    // close outfile
    fclose(outptr);

    // that's all folks
    return 0;
}
