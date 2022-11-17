import matplotlib.pyplot as plt

data = {
    'Fuyu Persimmons': 100,
    'Mangos': 100,
    'Peaches + Nectarines': 100,
    'Bananas': 80,
    'Kiwis': 70,
    'Apples': 60,
    'Oranges': 50
}
fruits = list(data.keys())
taste = list(data.values())

fig = plt.figure(figsize=(12, 5))
plt.bar(fruits, taste)
# plt.title('Taste score')
plt.show()


image_format = 'svg'  # e.g .png, .svg, etc.
image_name = 'fig01-python-example.svg'

fig.savefig(image_name, format=image_format, dpi=1200)
