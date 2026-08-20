"""Model package wiring.

Importing this package loads all model modules so they can be discovered
consistently by application startup code.
"""

from . import book
from . import lending
from . import LendingCartItem
from . import orders
from . import PurchaseCartItem
from . import user

__all__ = [
	"book",
	"lending",
	"LendingCartItem",
	"orders",
	"PurchaseCartItem",
	"user",
]
